<?php
class FeatureCollection
{
	var $type;
	var $features;
	
	function FeatureCollection()
	{
		$this->type = "FeatureCollection";
		$this->features = array();
	}
	
	function addFeature($feature) {
		array_push($this->features,$feature);
	} 
}

class Feature
{
	var $type;
	var $geometry;
	var $id;
	var $properties;
	
	function Feature($id,$geom,$properties) {
		$this->type = "Feature";
		$this->geometry = $geom;
		$this->id = $id;
		$this->properties = $properties;
	}
}
?>
